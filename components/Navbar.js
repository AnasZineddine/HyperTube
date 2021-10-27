import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <h1>Hypertube</h1>
      </div>
      <Link href="/signin">
        <a>Sign in</a>
      </Link>
      <Link href="/signup">
        <a>Sign up</a>
      </Link>
    </nav>
  );
};

export default Navbar;
