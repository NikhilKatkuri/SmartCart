import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from "clsx";

function cn(...clasNames: ClassValue[]) {
  return twMerge(clsx(...clasNames));
}

export default cn;
