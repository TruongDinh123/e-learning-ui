import {Button, Col, List, Row, Select, Typography} from 'antd';
import {memo, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import ModalDetailQuiz from './modalDetailQuiz';
import moment from 'moment';

const ListItem = ({userTested, quizsFilter}) => {
  const allscoreQuiz = useSelector((state) => state.quiz.allscoreQuiz);
  const [selectTestNumData, setSelectTestNumData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scoreCurrentInfo, setScoreCurrentInfo] = useState(null);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (allscoreQuiz && allscoreQuiz.length) {
      const scoresUser = allscoreQuiz
        .filter((score) => {
          const checkScoreCurrent =
            score.user === userTested._id &&
            userTested.quizId === score.quiz._id;
          const checkquizCurrent = quizsFilter.includes(score.quiz._id);
          const isValid =
            quizsFilter && quizsFilter.length
              ? checkScoreCurrent && checkquizCurrent
              : checkScoreCurrent;

          return isValid;
        })
        .sort((item1, item2) => item1.orderNum - item2.orderNum);

      let isExist = false;
      const dataSelectInit = scoresUser.map((item) => {
        if (scoreCurrentInfo?._id === item._id) isExist = true;
        return {
          label: `Lần ${item.orderNum}`,
          value: item._id,
        };
      });

      const scoreCurrentId =
        (isExist && scoreCurrentInfo?._id) ||
        dataSelectInit[dataSelectInit.length - 1]?.value;

      setSelectTestNumData(dataSelectInit);
      const scoreInfo = allscoreQuiz.find((item) => {
        const checkScoreCurrent = item._id === scoreCurrentId;
        const checkquizCurrent = quizsFilter.includes(item.quiz._id);

        const isValid =
          quizsFilter && quizsFilter.length
            ? checkScoreCurrent && checkquizCurrent
            : checkScoreCurrent;
        return isValid;
      });

      setScoreCurrentInfo(scoreInfo);
    }
  }, [allscoreQuiz, quizsFilter, scoreCurrentInfo, userTested._id, userTested.quizId]);

  const handleChange = (value) => {
    const scoreInfo = allscoreQuiz.find((item) => item._id === value);
    setScoreCurrentInfo(scoreInfo);
  };

  return (
    <List.Item>
      <Row style={{width: '100%'}}>
        <Col span={6}>
          <Typography>{userTested.quizName}</Typography>
        </Col>
        <Col span={4}>
          <Typography>
            {userTested.firstName} {userTested.lastName}
          </Typography>
        </Col>
        <Col span={8}>
          <Select
            showSearch
            style={{
              width: 140,
            }}
            loading={!!!allscoreQuiz}
            value={scoreCurrentInfo?._id}
            onChange={handleChange}
            placeholder='Search to Select'
            optionFilterProp='children'
            filterOption={(input, option) =>
              (option?.label ?? '').includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={selectTestNumData}
          />
          <Button
            className='ml-3'
            style={{width: '130px'}}
            onClick={() => setIsModalOpen(true)}
          >
            Xem chi tiết
          </Button>
        </Col>
        <Col span={2}>{scoreCurrentInfo?.scoreCustom || scoreCurrentInfo?.score || 0}</Col>
        <Col span={4}>
          {moment(scoreCurrentInfo?.submitTime).format('DD/MM/YYYY HH:mm:ss')}
        </Col>
      </Row>
      {isModalOpen && scoreCurrentInfo && (
        <ModalDetailQuiz
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          scoreCurrentInfo={scoreCurrentInfo}
        />
      )}
    </List.Item>
  );
};

export default memo(ListItem);
