import cn from "@/config/cn";

type variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
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
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-secondary-500 text-black hover:bg-secondary-600",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
    outline:
      "bg-transparent border border-gray-300 text-gray-500 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  },
  "Icon-text": {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-secondary-500 text-black hover:bg-secondary-600",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
    outline:
      "bg-transparent border border-gray-300 text-gray-500 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  },
  text: {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-secondary-500 text-black hover:bg-secondary-600",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
    outline:
      "bg-transparent border border-gray-300 text-gray-500 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  },
};

function Button({
  variant = "secondary",
  buttontype = "Icon",
  className = "",
  ...props
}: ButtonProps) {
  const getVariantClasses = (variant: variant, buttonType: buttonType) => {
     
    return variantClasses[buttonType][variant];
  };

  return (
    <button
      {...props}
      className={cn(getVariantClasses(variant, buttontype), className)}
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
