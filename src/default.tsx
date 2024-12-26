import "./app.css";
import { ComponentChildren } from "preact";

export function Default({ children }: { children: ComponentChildren }) {
  return (
    <>
      <header className="header">
        <div className="logo">MyLogo</div>
        <nav className="nav">
          <a href="/">
            <button>home</button>
          </a>
          <a href="/about">
            <button>about</button>
          </a>
          <a href="/livedata">
            <button>contact</button>
          </a>
        </nav>
        <div className="search">
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div>
        <div className="profile">
          <img src="profile.jpg" alt="Profile" className="profile-pic" />
          <span>Username</span>
        </div>
      </header>

      <main className="main">{children}</main>
    </>
  );
}
