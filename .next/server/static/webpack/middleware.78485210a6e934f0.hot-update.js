"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("middleware",{

/***/ "(middleware)/./middleware.js":
/*!***********************!*\
  !*** ./middleware.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clerk/nextjs/server */ \"(middleware)/./node_modules/@clerk/nextjs/dist/esm/server/routeMatcher.js\");\n/* harmony import */ var _clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clerk/nextjs/server */ \"(middleware)/./node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js\");\n\nconst isProtectedRoute = (0,_clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_0__.createRouteMatcher)([\n    '/dashboard(.*)',\n    '/events(.*)',\n    '/meetings(.*)',\n    '/availability(.*)'\n]);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_1__.clerkMiddleware)((auth, req)=>{\n    if (!auth().userId && isProtectedRoute(req)) {\n        return auth().redirectToSignIn();\n    }\n}));\nconst config = {\n    matcher: [\n        // Skip Next.js internals and all static files, unless found in search params\n        '/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',\n        // Always run for API routes\n        '/(api|trpc)(.*)'\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbWlkZGxld2FyZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTRFO0FBRTVFLE1BQU1FLG1CQUFtQkQsd0VBQWtCQSxDQUFDO0lBQUM7SUFBa0I7SUFBZTtJQUFpQjtDQUFxQjtBQUVwSCxpRUFBZUQscUVBQWVBLENBQUMsQ0FBQ0csTUFBTUM7SUFDbEMsSUFBRyxDQUFDRCxPQUFPRSxNQUFNLElBQUlILGlCQUFpQkUsTUFBSztRQUN2QyxPQUFPRCxPQUFPRyxnQkFBZ0I7SUFDbEM7QUFDSixFQUFFLEVBQUM7QUFFSSxNQUFNQyxTQUFTO0lBQ3BCQyxTQUFTO1FBQ1AsNkVBQTZFO1FBQzdFO1FBQ0EsNEJBQTRCO1FBQzVCO0tBQ0Q7QUFDSCxFQUFFIiwic291cmNlcyI6WyIvVXNlcnMvaGx1by9Eb2N1bWVudHMvR2l0SHViL2hlZGdlc2NoZWQvbWlkZGxld2FyZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjbGVya01pZGRsZXdhcmUgLCBjcmVhdGVSb3V0ZU1hdGNoZXIgfSBmcm9tICdAY2xlcmsvbmV4dGpzL3NlcnZlcic7XG5cbmNvbnN0IGlzUHJvdGVjdGVkUm91dGUgPSBjcmVhdGVSb3V0ZU1hdGNoZXIoWycvZGFzaGJvYXJkKC4qKScsICcvZXZlbnRzKC4qKScsICcvbWVldGluZ3MoLiopJywgJy9hdmFpbGFiaWxpdHkoLiopJyxdKVxuXG5leHBvcnQgZGVmYXVsdCBjbGVya01pZGRsZXdhcmUoKGF1dGgsIHJlcSkgPT4ge1xuICAgIGlmKCFhdXRoKCkudXNlcklkICYmIGlzUHJvdGVjdGVkUm91dGUocmVxKSl7XG4gICAgICAgIHJldHVybiBhdXRoKCkucmVkaXJlY3RUb1NpZ25JbigpOyAgIFxuICAgIH1cbn0pOyBcblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgbWF0Y2hlcjogW1xuICAgIC8vIFNraXAgTmV4dC5qcyBpbnRlcm5hbHMgYW5kIGFsbCBzdGF0aWMgZmlsZXMsIHVubGVzcyBmb3VuZCBpbiBzZWFyY2ggcGFyYW1zXG4gICAgJy8oKD8hX25leHR8W14/XSpcXFxcLig/Omh0bWw/fGNzc3xqcyg/IW9uKXxqcGU/Z3x3ZWJwfHBuZ3xnaWZ8c3ZnfHR0Znx3b2ZmMj98aWNvfGNzdnxkb2N4P3x4bHN4P3x6aXB8d2VibWFuaWZlc3QpKS4qKScsXG4gICAgLy8gQWx3YXlzIHJ1biBmb3IgQVBJIHJvdXRlc1xuICAgICcvKGFwaXx0cnBjKSguKiknLFxuICBdLFxufTsiXSwibmFtZXMiOlsiY2xlcmtNaWRkbGV3YXJlIiwiY3JlYXRlUm91dGVNYXRjaGVyIiwiaXNQcm90ZWN0ZWRSb3V0ZSIsImF1dGgiLCJyZXEiLCJ1c2VySWQiLCJyZWRpcmVjdFRvU2lnbkluIiwiY29uZmlnIiwibWF0Y2hlciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(middleware)/./middleware.js\n");

/***/ })

});