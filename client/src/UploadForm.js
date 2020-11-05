import { gql, useMutation } from '@apollo/client';

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
    }
  }
`;

const UploadForm = () => {
  const [uploadHandler, { loading }] = useMutation(UPLOAD_FILE);

  const handleFileChange = async (e) => {
    if (!e.target.files[0]) return;
    try {
      const { data } = await uploadHandler({
        variables: { file: e.target.files[0] },
      });
      console.log('data 🔫 ', data);
    } catch (err) {
      console.log('err 🔫 ', err);
    }
  };
  return (
    <div>
      <h1>Upload file</h1>
      <input type='file' onChange={handleFileChange} />
      {loading && <div>UPLOADING......</div>}
    </div>
  );
};

export default UploadForm;
