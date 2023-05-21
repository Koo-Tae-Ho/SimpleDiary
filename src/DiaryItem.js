import React, { useRef, useState, useEffect } from "react";

const DiaryItem = ({
  onEdit,
  onRemove,
  author,
  content,
  emotion,
  created_date,
  id,
}) => {
  useEffect(() => {
    console.log(`${id}번 째 아이템 렌더`);
  });
  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => setIsEdit(!isEdit); //반전 연산(true값을 가지면 수정중)

  const [localContent, setLocalContent] = useState(content); //수정폼을 관리하는 localContent기본값을 content로 해주면서 수정하기를 눌렀을 때 그대로 content값을 가져온다.
  const localContentInput = useRef(); //foucus할때 이용

  const handleRemove = () => {
    console.log(id);
    if (window.confirm(`${id}번째 일기를 정말 삭제하시겠습까?`)) {
      onRemove(id);
    }
  };

  const handleQuitEdit = () => {
    //수정상태에서 나간다.
    setIsEdit(false);
    setLocalContent(content); //수정을 하다가 취소하고 다시 수정하기를 눌러도 원래 content값이 들어와있음.
  };

  const handleEdit = () => {
    if (localContent.length < 5) {
      //수정된 일기가 5번글자 이하면 focus
      localContentInput.current.focus();
      return;
    }

    if (window.confirm(`${id}번 째 일기를 정말 수정하시겠습니까?`)) {
      //수정확인창을 띄우고
      onEdit(id, localContent); //확인하면 수정
      toggleIsEdit(); //수정폼을 닫아줌(수정된 일기로 교체)
    }
  };

  return (
    <div className="DiaryItem">
      <div class="Info">
        <span>
          작성자: {author} | 감정점수: {emotion}
        </span>
        <br />
        <span className="date">
          일기 작성 날짜: {new Date(created_date).toLocaleString()}
        </span>
      </div>
      <div className="content">
        {isEdit ? (
          <>
            <textarea
              ref={localContentInput}
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
            />
          </>
        ) : (
          <>{content}</>
        )}
      </div>

      {isEdit ? ( //true일경우 수정중, false일경우 원래상태
        <>
          <button onClick={handleQuitEdit}>수정취소</button>
          <button onClick={handleEdit}>수정완료</button>
        </>
      ) : (
        <>
          <button onClick={handleRemove}>삭제하기</button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </div>
  );
};

export default React.memo(DiaryItem);
