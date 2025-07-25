Console Error

Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

See more info here: https://nextjs.org/docs/messages/react-hydration-error

- data-new-gr-c-s-check-loaded="8.932.0"
- data-gr-ext-installed=""

Call Stack
createUnhandledError
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_client_9bb038.*.js (744:19)
handleClientError
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_client_9bb038.*.js (905:98)
error
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_client_9bb038.*.js (1036:56)
[project]/node*modules/its-fine/dist/index.js [app-client] (ecmascript)/console.error
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node_modules_8c0a71.*.js (1268:18)
emitPendingHydrationWarnings
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_compiled_react-dom_1f56dc.*.js (2766:103)
completeWork
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_compiled_react-dom_1f56dc.*.js (7226:102)
runWithFiberInDEV
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_compiled_react-dom_1f56dc.*.js (631:20)
completeUnitOfWork
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_compiled_react-dom_1f56dc.*.js (7996:23)
performUnitOfWork
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_compiled_react-dom_1f56dc.*.js (7938:28)
workLoopConcurrent
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_compiled_react-dom_1f56dc.*.js (7932:75)
renderRootConcurrent
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_compiled_react-dom_1f56dc.*.js (7914:71)
performWorkOnRoot
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_compiled_react-dom_1f56dc.*.js (7553:112)
performWorkOnRootViaSchedulerTask
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_compiled_react-dom_1f56dc.*.js (8387:26)
performWorkUntilDeadline
file:/D:/Apps/3DApp/3DFinal/3Dapp/.next/static/chunks/node*modules_next_dist_compiled_107ce8.*.js (2348:72)
