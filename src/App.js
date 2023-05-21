import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

//https://jsonplaceholder.typicode.com/comments
/*
const dummyList = [
  {
    id: 1,
    author: "이정환",
    content: "하이 1",
    emotion: 5,
    created_date: new Date().getTime(),
  },
  {
    id: 2,
    author: "홍길동",
    content: "하이 2",
    emotion: 2,
    created_date: new Date().getTime(),
  },
  {
    id: 3,
    author: "유인나",
    content: "하이 3",
    emotion: 3,
    created_date: new Date().getTime(),
  },
  {
    id: 4,
    author: "그리디언",
    content: "하이 4",
    emotion: 4,
    created_date: new Date().getTime(),
  },
];*/

function App() {
  const [data, setData] = useState([]); // data:일기 데이터, 일기 데이터는 빈배열로 시작, setDate: 일기 상태변화
  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1, //0부터4까지의 랜덤난수 생성(floor로 정수로 바꿈)
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    }); //0~19인덱스까지 짜름, 배열의 각각 모든요소를 순회해서 map함수의 콜백함수안에서 리턴하는 값들을 모아서 배열을 만들어 initData에 넣음
    setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
    //새로운 일기를 추가함
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData((data) => [newItem, ...data]); //setData함수에 함수를 전달하는 것을 함수 업데이트
  }, []); //배열을 비워도 항상 최신의 state를 data 인자를 통해 참고할 수 있게되면서 배열을 비워도됨.

  const onRemove = useCallback((targetId) => {
    setData((data) => data.filter((it) => it.id !== targetId)); //setData함수에 전달되는 파라미터에 최신 state가 전달되기 때문에, 항상 최신 state를 이용하기 위해서는 함수형 업데이트에 인자부분의 데이터를 사용, 리턴부분에 데이터를 사용해야 최신형 업데이트를 사용가능
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    //targetId를 갖는 일기를 수정하는 함수
    setData(
      (
        data //setDate를 통해 값을 전달할꺼임
      ) =>
        data.map((it) =>
          it.id === targetId ? { ...it, content: newContent } : it
        )
    );
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    //console.log("일기 분석 시작");

    const goodCount = data.filter((it) => it.emotion >= 3).length; //감정이 좋은 일기
    const badCount = data.length - goodCount; //감정이 안좋은 일기
    const goodRatio = (goodCount / data.length) * 100; //감정이 좋은 일기의 비율
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis; //값을 사용해야하기 때문에 () 빼준다.

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>감정이 좋은 일기 개수: {goodCount}</div>
      <div>감정이 좋은 일기 개수: {badCount}</div>
      <div>감정이 좋은 일기 비율: {goodRatio}</div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
}
//data만 diaryList로 넘겨준다.
export default App;
