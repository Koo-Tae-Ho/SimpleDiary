import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

//v1.0.2(Context생성, Context Provider 만들어서 Props 드릴링 해결)

const reducer = (state, action) => {
  //상태변화가 일어나기 직전의 state, 어떤 상태변화를 일으켜야하는지에 대한 정보를 담은 action 객체
  switch (
    action.type //reducer가 리턴하는 값이 새로운 상태의 값
  ) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};
//dispatch를 호출하면 reducer가 실행되고, 그 reducer가 리턴하는 값이 data의 값이 됨.

export const DiaryStateContext = React.createContext(); //export default는 파일 하나당 하나밖에 못 사용함.
export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, []);
  // 기존의 state이름: data, 항상 dispatch, reducer: 상태변화를 처리할 함수(직접구현), dataState의 초기값

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

    dispatch({ type: "INIT", data: initData });
  };

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
    //새로운 일기를 추가함
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });

    dataId.current += 1;
  }, []); //배열을 비워도 항상 최신의 state를 data 인자를 통해 참고할 수 있게되면서 배열을 비워도됨.

  const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    //targetId를 갖는 일기를 수정하는 함수
    dispatch({ type: "EDIT", targetId, newContent });
  }, []);

  const memoizedDispatches = useMemo(() => {
    //useMemo를 활용하여 재생성되지 않게 객체를 묶어줘야함
    return { onCreate, onRemove, onEdit };
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
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor />
          <div>전체 일기 : {data.length}</div>
          <div>감정이 좋은 일기 개수: {goodCount}</div>
          <div>감정이 좋은 일기 개수: {badCount}</div>
          <div>감정이 좋은 일기 비율: {goodRatio}</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}
//data만 diaryList로 넘겨준다.
export default App;
