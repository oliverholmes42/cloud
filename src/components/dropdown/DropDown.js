import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const DropDown = ({ options, value, onChange, name }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Map your list of objects to match the `react-select` format (value and label)
  const formattedOptions = options.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  // Set the initial selected options based on currentValues (list of ids)
  useEffect(() => {
    const preSelectedOptions = formattedOptions.filter((option) =>
      value.includes(option.value)
    );
    setSelectedOptions(preSelectedOptions);
  }, []);

  // Handle selection changes and pass them back to the parent component
  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
    onChange(name, selected); // Call the parent's onChange to update the formData state
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: '16px', // Increase font size for selected option
      width: '300px',   // Set a fixed width, or you can use maxWidth
      // maxWidth: '100%', // Or you can use maxWidth for responsiveness
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: '16px', // Increase font size in the dropdown menu
    }),
    multiValue: (provided) => ({
      ...provided,
      fontSize: '16px', // Increase font size for multi-select selected values
    }),
    option: (provided) => ({
      ...provided,
      fontSize: '16px', // Increase font size for individual options in the dropdown
    }),
  };

  return (
    <div>
      <Select
        styles={customStyles}
        isMulti
        menuPortalTarget={document.body}
        value={selectedOptions}
        onChange={handleSelectChange}
        options={formattedOptions}
        placeholder=""
      />
    </div>
  );
};

export default DropDown;
