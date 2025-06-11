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

function test4()
    --[[
        The below code demonstrates how you can use use explicit opcodes as function calls for things that aren't
        already implemented in this language.
        Branch and hat blocks are not supported, but command and reporter blocks are.
    ]]--
    motion_movesteps(10)
    sensing_askandwait("What is your name?")
    print("Hello, " .. sensing_answer() .. "!", 2)
    if sensing_answer() ~= "Joe" and sensing_answer() ~= "joe" and operator_trueBoolean() then
        print("You're not Joe!", 2)
    else
        print("You're Joe!", 2)
    end
end

function test5()
    --[[
        The below code demonstrates how to use and declare variables.
        Variables can be declared as local or global.
        Local variables are defined under the main sprite, while global
        variables are defined under the stage.
        You can use the `local` keyword to declare a local variable, or you can just use the variable name
        to declare a global variable.
        Variables can be assigned values using the `=` operator.
    ]]--
    local myLocalVariable = 10 -- This is a local variable
    myGlobalVariable = 20 -- This is a global variable, no `local` keyword used
    print("myLocalVariable: " .. myLocalVariable) -- This will print "myLocalVariable: 10"
    print("myGlobalVariable: " .. myGlobalVariable) -- This will print "myGlobalVariable: 20"
    for i = 1, 5 do
        print("Loop iteration: " .. i, 0.5) -- This will print "Loop iteration: 1", "Loop iteration: 2", etc.
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
    test4()
    test5()
end

