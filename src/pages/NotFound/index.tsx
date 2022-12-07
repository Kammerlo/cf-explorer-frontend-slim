import { Link } from "react-router-dom";
import { NotFoundIcon } from "../../commons/resources";
import { routers } from "../../commons/routers";
import styles from "./index.module.scss";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <img src={NotFoundIcon} alt="404" />
      <h3>Sorry! The page you’re looking for cannot be found.</h3>
      <Link className={styles.backToHome} to={routers.HOME}>
        Back to home
      </Link>
    </div>
  );
};
export default NotFound;
