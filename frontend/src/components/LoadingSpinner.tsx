import { RingLoader } from "react-spinners";

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
    <RingLoader color="#36d7b7" size={150} />
  </div>
);

export default LoadingSpinner;
