export const dataFileInit = ({ bannerFile, logoFile, ruleFile }) => {
  const dataInit = [];
  if (bannerFile) dataInit.push({
    info: {
      fieldUrl: "banner_url",
      fieldName: "banner_name",
      
    },
    file: bannerFile
  });

  if (logoFile) dataInit.push({
    info: {
      fieldUrl: "image_url",
      fieldName: "filename",
    },
    file: logoFile
  });

  if (ruleFile) dataInit.push({
    info: {
      fieldUrl: "rule_file_url",
      fieldName: "rule_file_name",
    },
    file: ruleFile
  });

  return dataInit;
}

export const extractDataFile = (dataInfo) => {
  const formData = new FormData();
  dataInfo.forEach(element => {
    if (element.info.fieldName === 'banner_name') {
      formData.append("logoFileInfo", JSON.stringify(element.info));
      formData.append("files", element.file)
    }
    if (element.info.fieldName === 'filename') {
      formData.append("bannerFile", JSON.stringify(element.info));
      formData.append("files", element.file)
    }
    if (element.info.fieldName === 'rule_file_name') {
      formData.append("rulesFileName", JSON.stringify(element.info));
      formData.append("files", element.file)
    }
  });

  return formData;
}