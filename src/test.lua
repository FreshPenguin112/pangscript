--[[
    This is a comment.
    Comments are ignored by the compiler and are used to explain your code.
    You can use single-line comments with `-- whatever` or multi-line comments as shown in this comment block.
]]--

--[[
    I'm too lazy to properly demonstrate all the conditions and available operators you can use, so here's the internal list lmao.
        {
            "+": { opcode: "operator_add"},
            "-": { opcode: "operator_subtract"},
            "*": { opcode: "operator_multiply"},
            "/": { opcode: "operator_divide"},
            "%": { opcode: "operator_mod"},
            "^": { opcode: "operator_power"},
            "<": { opcode: "operator_lt"},
            ">": { opcode: "operator_gt"},
            "<=": { opcode: "operator_ltorequal"},
            ">=": { opcode: "operator_gtorequal"},
            "==": { opcode: "operator_equals"},
            "~=": { opcode: "operator_notequal"},
            "and": { opcode: "operator_and"},
            "or": { opcode: "operator_or"},
            }
            You can also the unary "-" operator before a number to make it negative.
            You can also use the `not` operator to negate a boolean value.
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

function test3()
    --[[
        The below code demonstrates how to use if-else statements.
        You can use if statements, elseif statements, and else statements to control the flow of your program.
        The conditions are evaluated in order, and the first true condition's block is executed.
    ]]--
    if 5 < 3 then
        print("5 is less than 3")
    elseif 5 == 3 then
        print("5 is equal to 3")
    elseif 5 + 3 == 8 then
        print("5 plus 3 is equal to 8")
    else
        print("idek man")
    end
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
    test3()
    motion_movesteps(10)
    sensing_askandwait("What is your name?")
    print("Hello, " .. sensing_answer() .. "!")
end

