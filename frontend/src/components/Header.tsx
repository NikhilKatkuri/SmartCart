import Button from "./ui/Button";

function Header() {
  return (
    <header className="w-full h-16 bg-bg-01">
      <div className="w-full h-full flex items-center justify-between px-3">
        {/* left side */}
        <div className="flex items-center gap-2">
          <Button
            buttonicon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="black"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            }
          />
        </div>
        <div className="flex items-center gap-2"></div>
        <div className="flex items-center gap-2"></div>
      </div>
    </header>
  );
}

export default Header;
