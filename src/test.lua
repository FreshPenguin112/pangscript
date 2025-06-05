--[[
    This is a comment.
    Comments are ignored by the compiler and are used to explain your code.
    You can use single-line comments with `-- whatever` or multi-line comments as shown in this comment block.
]]--

function test()
    --[[
        The below code demonstrates how to use the print function.
        Print blocks compile into standard `say (...)` blocks.
        The below code also demonstrates how to use the `..` operator to concatenate(join) literals together.
    ]]--
    print("test " .. 1) -- This will print "test 1"
    print("test " .. 2) -- This will print "test 2"
    print("test " .. 3) -- This will print "test 3"
    print("test " .. "Another string")  -- This will print "test Another string"
end

function test1()
    --[[
        The below code demonstrates how to use the print function with a second argument.
        When you pass a second argument to the print function, it will compile into a 
        `say (...) for (...) seconds` block, using the second argument as the duration in seconds.
    ]]--
    print("test1 " .. 1, 1) -- This will print "test1 1" for 1 second
    print("test1 " .. 2, 1) -- This will print "test1 2" for 1 second
end

function test2()
    --[[
        The below code demonstrates mathematical expressions.
        The print function can also be used to print the result of mathematical expressions.
        The order of operations is the same as in mathematics, so multiplication and division
        are performed before addition and subtraction.
    ]]--
    print(4 + 3 * 2 - 8 / 4)
end

function main()
    --[[
        The main function is a special reserved function that never gets compiled into a my blocks function,
        instead, the contents of this function get put under the initial when flag clicked block that
        the compiler automatically makes for you.
        This function is where you should put your code that you want to run when the program starts.
        If you don't have a main function, your code will not run anything.
    ]]--
    print("Hello, world!")
    test()
    test1()
    test2()
end