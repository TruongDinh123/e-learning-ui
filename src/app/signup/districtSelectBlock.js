import {useEffect, useState} from 'react';
import {options} from './utils';

const DistrictSelectBlock = ({
  formik,
  selectedCap,
  selectedDonVi,
  setSelectedCap,
  setSelectedDonVi,
  setDonViCon,
}) => {
  const [donViOptions, setDonViOptions] = useState([]);
  const [subUnits, setSubUnits] = useState([]);

  useEffect(() => {
    if (selectedCap === 'Cấp huyện') {
      setSubUnits(options['Cấp huyện'][selectedDonVi] || []);
    } else {
      setSubUnits([]);
    }
  }, [selectedDonVi, selectedCap]);

  useEffect(() => {
    if (selectedCap === 'Cấp tỉnh') {
      setDonViOptions(options['Cấp tỉnh']);
      formik.handleChange('cap');
    } else if (selectedCap === 'Cấp huyện') {
      setDonViOptions(Object.keys(options['Cấp huyện']));
    } else if (selectedCap === 'Cấp xã') {
      setDonViOptions(options['Cấp xã']);
    }
    setSelectedDonVi('');
    setSubUnits([]);
  }, [selectedCap]);
  
  return (
    <div>
      <span className='text-sm font-medium'>Đơn vị công tác</span>

      <label className='flex flex-col' htmlFor='cap'>
        <select
          value={selectedCap}
          onChange={(e) => setSelectedCap(e.target.value)}
        >
          <option value=''>Chọn Cấp</option>
          <option value='Cấp tỉnh'>Cấp tỉnh</option>cd
          <option value='Cấp huyện'>Cấp huyện</option>
          <option value='Cấp xã'>Cấp xã</option>
        </select>
      </label>
      <label className='flex flex-col' htmlFor='donvi'>
        {selectedCap && (
          <select
            className='mt-2'
            value={selectedDonVi}
            onChange={(e) => setSelectedDonVi(e.target.value)}
            disabled={!selectedCap}
          >
            <option value=''>Chọn đơn vị</option>
            {donViOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit.replace(/^-+/, '')}
              </option>
            ))}
          </select>
        )}
      </label>
      <label className='flex flex-col' htmlFor='donvicon'>
        {selectedDonVi && subUnits.length !== 0 && (
          <select
            className='mt-2'
            disabled={!selectedDonVi || subUnits.length === 0}
            onChange={(e) => setDonViCon(e.target.value)}
          >
            <option value=''>Chọn đơn vị con</option>
            {subUnits.map((subUnit) => (
              <option key={subUnit} value={subUnit}>
                {subUnit.replace(/^-+/, '')}
              </option>
            ))}
          </select>
        )}
      </label>
    </div>
  );
};

export default DistrictSelectBlock;
