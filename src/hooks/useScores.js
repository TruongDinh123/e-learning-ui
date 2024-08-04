import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  getNumberUserInQuiz,
  getScoreHasUsersTested,
} from '../features/Quiz/scoreThunk';
import {
  paginationDefault,
  refreshStatusInit,
} from '../app/admin/scores/setting';
import {message} from 'antd';

const useScores = () => {
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(0);
  const [quizsFilter, setQuizsFilter] = useState([]);
  const [textSearch, setTextSearch] = useState('');
  const [pagination, setPagination] = useState(paginationDefault);
  const [refreshStatus, setRefreshStatus] = useState('');

  useEffect(() => {
    if (refresh) {
      dispatch(getNumberUserInQuiz({quizsFilter, searchName: ''}));

      dispatch(
        getScoreHasUsersTested({
          quizsFilter,
          ...paginationDefault,
          searchName: '',
        })
      ).then((res) => {
        message.success('Đã làm mới dữ liệu!', 1.5);
      });

      setTextSearch('');
      setPagination({...paginationDefault, current: 1});
    }
  }, [dispatch, refresh]);

  useEffect(() => {
    if (refreshStatus === refreshStatusInit.pagination) {
      dispatch(getNumberUserInQuiz({quizsFilter, searchName: textSearch}));

      dispatch(
        getScoreHasUsersTested({
          quizsFilter,
          ...pagination,
          searchName: textSearch,
        })
      ).then((res) => {
        message.success('Đã làm mới dữ liệu!', 1.5);
        setRefreshStatus('');
      });
    }
  }, [dispatch, refreshStatus]);

  useEffect(() => {
    if (refreshStatus === refreshStatusInit.quizsFilter) {
      dispatch(getNumberUserInQuiz({quizsFilter, searchName: textSearch}));

      dispatch(
        getScoreHasUsersTested({
          quizsFilter,
          searchName: textSearch,
          ...paginationDefault,
        })
      ).then((res) => {
        message.success('Đã làm mới dữ liệu!', 1.5);
        setRefreshStatus('');
      });
      setPagination({...paginationDefault, current: 1});
    }
  }, [dispatch, refreshStatus]);

  useEffect(() => {
    if (refreshStatus === refreshStatusInit.textSearch) {
      dispatch(getNumberUserInQuiz({quizsFilter, searchName: textSearch}));

      dispatch(
        getScoreHasUsersTested({
          quizsFilter,
          searchName: textSearch,
          ...paginationDefault,
        })
      ).then((res) => {
        message.success('Đã làm mới dữ liệu!', 1.5);
        setRefreshStatus('');
      });

      setPagination({...paginationDefault, current: 1});
    }
  }, [dispatch, refreshStatus]);

  return {
    refresh,
    quizsFilter,
    textSearch,
    pagination,
    setPagination,
    setRefresh,
    setQuizsFilter,
    setTextSearch,
    setRefreshStatus,
  };
};

export default useScores;
