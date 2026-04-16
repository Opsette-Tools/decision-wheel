import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button, Result } from "antd";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        status="404"
        title="404"
        subTitle="Page not found"
        extra={<Button type="primary" href="/">Return Home</Button>}
      />
    </div>
  );
};

export default NotFound;
