const { CircularProgress } = require("@mui/material");

const PageLoader = () => {
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <CircularProgress />
    </div>
  );
};

export { PageLoader };
