import { Outlet } from "react-router-dom";
import AlertBanner from '../AlertBanner/AlertBanner';
import Header from '../Header/Header';

export default () => {
  return (
    <>
      <AlertBanner />
      <Header className="wrap" />
      <main>
        <Outlet />
      </main>
    </>
  );
}
