import Button from "./ui/Button";

function Header() {
  return (
    <header className="group w-full  *:text-slate-700 lg:max-w-4xl mx-auto lg:mt-3 h-16 bg-bg-01 sticky top-0  lg:rounded-full shadow-xs overflow-hidden z-10">
      <div className="w-full h-full flex items-center justify-between px-3">
        {/* left side */}
        <div className="flex items-center gap-2 relative move-x">
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
            className=""
          />
          <h1 className="text-lg font-medium text-slate-700">SmartCart</h1>
        </div>
        <div className="flex items-center gap-2"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              buttonicon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
