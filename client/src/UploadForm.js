import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
    }
  }
`;

const UploadForm = () => {
  const [uploadHandler, { loading }] = useMutation(UPLOAD_FILE);
  const [result, setResult] = useState(null);
  const handleFileChange = async (e) => {
    if (!e.target.files[0]) return;
    try {
      const { data } = await uploadHandler({
        variables: { file: e.target.files[0] },
      });
      setResult(data.uploadFile.url);
    } catch (err) {
      console.log('HATA', err.message);
      setResult(null);
    }
  };
  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      {loading && <div>loading...</div>}
      {result && (
        <div>
          <img src={result} alt='asdkj' />
        </div>
      )}
    </div>
  );
};

export default UploadForm;
