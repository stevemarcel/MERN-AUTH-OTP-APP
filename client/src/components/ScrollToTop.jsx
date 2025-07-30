import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
	const { pathname } = useLocation(); // Get the current path

	useEffect(() => {
		// When the pathname changes (i.e., route changes), scroll to the top
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

export default ScrollToTop;
