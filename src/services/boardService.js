import http from './http';

export default {
  postPost({ // 게시글 작성
    classId,
    name,
    content,
    fileGuid,
  }) {
    return http.post(`/classes/${classId}/boards`, {
      name,
      content,
      fileGuid,
    });
  },
  postFile({ // 개별 파일 업로드
    file,
  }) {
    const form = new FormData();
    form.append('file', file, file.name);
    return http.post('/files/', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  modifyPost({ // 게시글 수정
    classId,
    name,
    content,
    fileGuid,
    boardId,
  }) {
    return http.put(`/classes/${classId}/boards/${boardId}`, {
      name,
      content,
      fileGuid,
    });
  },
  postFileWithID({ // 개별 파일 업로드 // 이미 작성된 글의 boardID를 이용한 파일 업로드
    classId,
    boardId,
    file,
  }) {
    const form = new FormData();
    form.append('file', file, file.name);
    return http.post(`/classes/${classId}/boards/${boardId}/file/`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deletePost({ // 게시글 삭제
    classId,
    boardId,
  }) {
    return http.delete(`/classes/${classId}/boards/${boardId}`);
  },
  getPostTotalCount({ // 게시글 갯수
    type,
    query,
    classId,
  }) {
    return http.get(`/classes/${classId}/boards/total-number?type=${type}&query=${query}`);
  },
  getPostList({ // 게시글 (검색) 리스트
    type,
    query,
    classId,
    pageNum,
  }) {
    return http.get(`/classes/${classId}/boards?page=${pageNum}&type=${type}&query=${query}`);
  },
  getPost({ // 게시글 불러오기
    classId,
    boardId,
  }) {
    return http.get(`/classes/${classId}/boards/${boardId}`);
  },
  postReply({ // 답변 쓰기
    boardId,
    content,
  }) {
    return http.post(`/boards/${boardId}/reply`, {
      content,
    });
  },
  deleteReply({ // 답변 삭제
    boardId,
    replyId,
  }) {
    return http.delete(`/boards/${boardId}/reply/${replyId}`);
  },
};
