function UploadFiles(multi, refFile, handleInputFile) {
  return (
    <input
      multiple={multi}
      type="file"
      accept="image/*"
      ref={refFile}
      onInput={handleInputFile}
      onClick={() => {
        e.target.value = null;
      }}
      hidden
    />
  );
}

export default UploadFiles;
