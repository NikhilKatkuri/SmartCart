import cn from "@/config/cn";

type variant = "primary" | "secondary" | "ghost";
type buttonType = "Icon" | "Icon-text" | "text";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: variant;
  buttontype?: buttonType;
  buttonicon?: React.ReactNode;
}

type varString = Record<variant, string>;
type varClass = Record<buttonType, varString>;

const variantClasses: varClass = {
  Icon: {
    primary: "",
    secondary: "",
    ghost:
      "bg-btn-ghost-bg hover:bg-btn-ghost-bg-hover active:bg-btn-ghost-bg-hover",
  },
  "Icon-text": {
    primary: "",
    secondary: "",
    ghost: "bg-btn-ghost-bg hover:bg-btn-ghost-bg-hover",
  },
  text: {
    primary: "",
    secondary: "",
    ghost: "",
  },
};

function Button({
  variant = "ghost",
  buttontype = "Icon",
  className = "",
  ...props
}: ButtonProps) {
  const dnc =
    "p-2  rounded-full flex items-center justify-center gap-2  transition-all ease-in-out duration-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:scale-95";
  const getVariantClasses = (variant: variant, buttonType: buttonType) => {
    return variantClasses[buttonType][variant];
  };

  return (
    <button
      {...props}
      className={cn(dnc, getVariantClasses(variant, buttontype), className)}
    >
      {(buttontype === "Icon" || buttontype === "Icon-text") && (
        <span>{props.buttonicon}</span>
      )}
      {buttontype === "Icon-text" && <span>{props.children}</span>}
      {buttontype === "text" && <span>{props.children}</span>}
    </button>
  );
}

export default Button;
