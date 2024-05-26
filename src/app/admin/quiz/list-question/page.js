import {Modal} from 'antd';
import {Fragment} from 'react';

const ListQuestino = () => {
  return (
    <Fragment>
      <Modal
        title={
          <h1 className='text-3xl font-bold text-blue-500'>
            Update the contest
          </h1>
        }
        width={1000}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={[
          <Button key='cancel' onClick={handleCancel} style={{marginRight: 8}}>
            Cancel
          </Button>,
          <Button
            key='ok'
            type='primary'
            onClick={handleOk}
            className='custom-button'
          >
            Save
          </Button>,
        ]}
      >
        <div className='mt-10'>
          <label htmlFor='course' className='fs-6 font-medium'>
            Contest title:
          </label>
          <CustomInput
            onChange={formik.handleChange('name')}
            onBlur={formik.handleBlur('name')}
            value={formik.values.name}
            error={formik.touched.name && formik.errors.name}
          />

          <label htmlFor='nameCenter' className='fs-6 font-medium'>
            Organizer:
          </label>
          <CustomInput
            onChange={formik.handleChange('nameCenter')}
            onBlur={formik.handleBlur('nameCenter')}
            value={formik.values.nameCenter}
          />

          <div>
            <ImageBlock
              data={data}
              file={file}
              logoOrg={logoOrg}
              handleBannerUpload={handleBannerUpload}
              handleOrganizerUpload={handleOrganizerUpload}
            />
          </div>

          <label
            htmlFor='courseDescription'
            className='text-lg font-medium mt-3'
          >
            Description and Regulation:
          </label>
          <ReactQuill
            theme='snow'
            value={formik.values.title}
            onChange={(content) => formik.setFieldValue('title', content)}
            onBlur={() => formik.setFieldTouched('title', true, true)}
            placeholder='Thêm mô tả'
            className='bg-white'
            modules={{
              toolbar: [
                [{header: [1, 2, false]}],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],

                [{list: 'ordered'}, {list: 'bullet'}],
                [{script: 'sub'}, {script: 'super'}],
                [{indent: '-1'}, {indent: '+1'}],
                [{direction: 'rtl'}],

                [
                  {
                    size: ['small', false, 'large', 'huge'],
                  },
                ],
                [{header: [1, 2, 3, 4, 5, 6, false]}],

                [{color: []}, {background: []}],
                [{font: []}],
                [{align: []}],

                ['clean'],
              ],
            }}
          />

          <label
            htmlFor='courseDescription'
            className='text-lg font-medium mt-3'
          >
            Thể lệ:
          </label>
          <ReactQuill
            theme='snow'
            value={formik.values.rules}
            onChange={(content) => formik.setFieldValue('rules', content)}
            onBlur={() => formik.setFieldTouched('rules', true, true)}
            placeholder='Thêm mô tả'
            className='bg-white'
            modules={{
              toolbar: [
                [{header: [1, 2, false]}],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],

                [{list: 'ordered'}, {list: 'bullet'}],
                [{script: 'sub'}, {script: 'super'}],
                [{indent: '-1'}, {indent: '+1'}],
                [{direction: 'rtl'}],

                [
                  {
                    size: ['small', false, 'large', 'huge'],
                  },
                ],
                [{header: [1, 2, 3, 4, 5, 6, false]}],

                [{color: []}, {background: []}],
                [{font: []}],
                [{align: []}],

                ['clean'],
              ],
            }}
          />
          <label
            htmlFor='courseDescription'
            className='text-lg font-medium mt-3'
          >
            Thể lệ upload file:
          </label>
          <Upload {...handleRulesUpload}>
            <Button className='mt-3' icon={<UploadOutlined />}>
              Choose logo
            </Button>
          </Upload>
          {data && !fileRule && (
            <a href={data.rule_file_url} download>
              {data.rulesFileName}
            </a>
          )}
        </div>
      </Modal>
    </Fragment>
  );
};

export default ListQuestion;
