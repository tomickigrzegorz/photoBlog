import { Mail } from "./modules/Mail";
import { BackToTop } from "./modules/BackToTop";
import { SmoothScroll } from "./modules/SmoothScroll";
import "./modules/Theme";

Mail();
BackToTop();
SmoothScroll();

const d = new Date();
let year = d.getFullYear();

const fullYear = document.querySelector(".fullYear");
fullYear.append(year);
