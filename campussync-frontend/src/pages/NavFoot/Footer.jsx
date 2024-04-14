import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-flex">
        <div>
          <img className="footer-logo" src="/logocampus.png" />
        </div>
        <div>
          <i className="fa-brands fa-facebook-f"></i>
          <Link target="_blank" to="https://github.com/GDSC-Hackaton/CampusSync-React-Frontend">
            <i className="fa-brands fa-github"></i>
          </Link>

          <i className="fa-brands fa-linkedin"></i>
        </div>
      </div>
    </div>
  );
};
export default Footer;
