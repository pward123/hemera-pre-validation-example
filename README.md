# Hemera Pre-validation Example

 1. Clone
 2. Run `yarn install`
 3. Run `node ./index.js`

The stack trace for the failure easily points out the location causing the problem (index.js 42:35)

Now change the `const which` value in index.js from 1 to 2 and run the application again

The stack trace information is not very helpful when you're trying to track down what code sent the invalid pattern

Now uncomment `prettyLog: false` and run the application again

The hemera log entry immediately preceding the `=== PreValidationError` still doesn't have useful information in the stack trace. However, it does have a `pattern` property that will at least tell us what the invalid pattern looked like.

By using the contract method to make the hemera.act call, we can reduce the need for decent stack traces on PreValidationErrors.

For PostValidationErrors, at least we have the ability to see the pattern for the service that has the problem.

I'm not sure what can be done to resolve this given the way pre/post validations are specified and executed. However, it would be really helpful for troubleshooting purposes.

At the very least, I'd add the pattern to the pretty-printed Pre/Post validation errors.
