'use client';
import React, {memo, useCallback, useMemo} from 'react';
import {Input, Tooltip} from 'antd';

const QuizItemFooter = ({
  quiz,
  currentPage,
  setCurrentPage,
  onChangePredictAmount,
  predictAmount,
  submitted,
  isComplete,
  indexOfLastQuestion,
}) => {
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const formatNumber = useCallback(
    (value) => new Intl.NumberFormat().format(value),
    []
  );
  const handleChangeInputNumber = (e) => {
    const {value: inputValue} = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      localStorage.setItem('predictAmount', inputValue);
      onChangePredictAmount(inputValue);
    }
  };

  // '.' at the end or only '-' in the input box.
  const handleBlurInputNumber = () => {
    let valueTemp = predictAmount;
    if (
      predictAmount.charAt(predictAmount.length - 1) === '.' ||
      predictAmount === '-'
    ) {
      valueTemp = predictAmount.slice(0, -1);
    }
    onChangePredictAmount(valueTemp.replace(/0*(\d+)/, '$1'));
  };

  const titleInputNumber = useMemo(
    () =>
      predictAmount ? (
        <span className='numeric-input-title'>
          {predictAmount !== '-' ? formatNumber(Number(predictAmount)) : '-'}
        </span>
      ) : (
        'Hãy nhập con số dự đoán'
      ),
    [formatNumber, predictAmount]
  );

  const isLastPage = useMemo(
    () => quiz?.questions?.length <= indexOfLastQuestion,
    [indexOfLastQuestion, quiz?.questions?.length]
  );

  return (
    <>
      {isLastPage && (
        <>
          <div className='flex items-center justify-content-md-start  border-t border-gray-200 pt-4 mt-4 first:border-t-0 first:mt-0'>
            <span className='font-medium text-black'>
              Câu {quiz?.questions?.length + 1}:{' '}
            </span>
            <div className='text-purple-950 font-bold mr-5 ml-1'>
              Dự đoán số người tham dự:
            </div>

            <Tooltip
              trigger={['focus']}
              title={titleInputNumber}
              placement='topLeft'
              overlayClassName='numeric-input'
            >
              <Input
                onChange={handleChangeInputNumber}
                onBlur={handleBlurInputNumber}
                placeholder='Nhập chữ số'
                maxLength={16}
                disabled={submitted || isComplete}
                value={predictAmount}
                style={{
                  width: 200,
                }}
              />
            </Tooltip>
          </div>

        </>
      )}

      <div className='flex justify-between mt-4'>
        {currentPage > 1 && (
          <button
            onClick={handlePreviousPage}
            className='px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300'
          >
            Trang trước
          </button>
        )}
        {quiz?.questions?.length > indexOfLastQuestion && (
          <button
            onClick={handleNextPage}
            className='px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300'
          >
            Trang sau
          </button>
        )}
      </div>
    </>
  );
};

export default memo(QuizItemFooter);
