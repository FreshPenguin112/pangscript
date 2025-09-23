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
            "&": { opcode: "pmOperatorsExpansion_binnaryAnd"},
            "|": { opcode: "pmOperatorsExpansion_binnaryOr"},
            "~": { opcode: "pmOperatorsExpansion_binnaryXor"},
            "<<": { opcode: "pmOperatorsExpansion_shiftLeft"},
            ">>": { opcode: "pmOperatorsExpansion_shiftRight"},
            "and": { opcode: "operator_and"},
            "or": { opcode: "operator_or"},
            }
            You can also the unary "-" operator before a number to make it negative.
            You can also use the `not` operator to negate a boolean value.
            You can also use the bitwise "~" operator to perform a bitwise NOT on a value
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
end

function test6()
    --[[
        The below code demonstrates how to use loops
        You can use for loops and while loops to repeat code.
        The for loop iterates over a range of numbers, while the while loop continues until a condition is false.
    ]]--
    for i = 1, 5 do -- This loops from 1 to 5
        print("This is iteration number: " .. i, 0.5)
    end
    local j = 1
    while j <= 5 do -- This loops while j is less than or equal to 5
        print("This is iteration number: " .. j, 0.5)
        local j += 1
    end
    --[[
        For loops can also have a step value, which is the third argument in the for loop.
        The step value determines how much the loop variable is incremented each iteration.
        The below code demonstrates a for loop with a step value of 2.
    ]]--
    for i = 1, 5, 2 do -- This loops from 1 to 5 with a step value of 2, i will be set as follows: 1, 3, 5.
        print("This is iteration number: " .. i, 0.5)
    end
end

function test7()
    --[[
        The below code demonstrates the use of compound assignment operators.
        Compound operators allow you to perform an operation and assignment in one step.
        The following compound operators are supported:
            += : addition assignment
            -= : subtraction assignment
            *= : multiplication assignment
            /= : division assignment
            ^= : exponentiation assignment
        The syntax is: variable <operator>= value
        This is equivalent to: variable = variable <operator> value
    ]]--
    local a = 5
    local a += 3 -- a = a + 3, a is now 8
    print("a after += 3: " .. a, 2)

    local b = 10
    local b -= 4 -- b = b - 4, b is now 6
    print("b after -= 4: " .. b, 2)

    local c = 2
    local c *= 7 -- c = c * 7, c is now 14
    print("c after *= 7: " .. c, 2)

    local d = 20
    local d /= 5 -- d = d / 5, d is now 4
    print("d after /= 5: " .. d, 2)

    local e = 2
    local e ^= 3 -- e = e ^ 3, e is now 8
    print("e after ^= 3: " .. e, 2)
end

function test8()
    --[[
        The below code demonstrates how to use bitwise operators.
        Bitwise operators allow you to perform operations on the individual bits of a number.
        The following bitwise operators are supported:
            & : bitwise AND
            | : bitwise OR
            ~ : bitwise XOR
            << : left shift
            >> : right shift
            ~ : bitwise NOT (unary form)(when put before a number like you do with the minus sign)
    ]]--

    local x = 5 -- 0101 in binary
    local y = 3 -- 0011 in binary
    local andResult = x & y -- 0001 in binary, which is 1 in decimal
    local orResult = x | y -- 0111 in binary, which is 7 in decimal
    local xorResult = x ~ y -- 0110 in binary, which is 6 in decimal
    local leftShiftResult = x << 1 -- 1010 in binary, which is 10 in decimal
    local rightShiftResult = x >> 1 -- 0010 in binary, which is 2 in decimal
    local notResult = ~x -- 1010 in binary, which is -6 in decimal (two's complement representation)
    print("x & y: " .. andResult, 0.5) -- This will print "x & y: 1"
    print("x | y: " .. orResult, 0.5) -- This will print "x | y: 7"
    print("x ~ y: " .. xorResult, 0.5) -- This will print "x ~ y: 6"
    print("x << 1: " .. leftShiftResult, 0.5) -- This will print "x << 1: 10"
    print("x >> 1: " .. rightShiftResult, 0.5) -- This will print "x >> 1: 2"
    print("~x: " .. notResult, 0.5) -- This will print "~x: -6"
end

function test9()
    -- Demonstrate length operator and nested tables
    arr = {10, 20, 30, 40}
    print("arr length: " .. #arr, 1)
    arr[2] = 99
    print("arr[2]: " .. arr[2], 1)

    local obj = {a = 1, b = 2}
    --print("nested.x: " .. obj.nested.x, 1)
    obj.c = 5 -- dot-assignment to add a field
    print("obj.c: " .. obj.c, 1)

    local s: string = "hello"
    print("string length: " .. #s, 1)
end

function test_string_indexing()
    -- Literal index on a typed string variable
    local s: string = "abcdef"
    print("s[3]: " .. s[3], 1)
    -- Substring literal range
    print("s[1..3]: " .. s[1..3], 1)
    -- Range-like access using two indices (simulate by calling substring block via visitor)
    -- We'll use variables so the compiler must treat s as a string
    local i = 2
    local j = 4
    print("s[i]: " .. s[i], 1)
    print("s[i..j]: " .. operator_getLettersFromIndexToIndexInTextFixed(i, j, s), 1)
end

-- Simple parameterized function and method-style table call
function addAndPrint(a, b)
    local res = a + b
    print("addAndPrint: " .. res, 1)
end

function test10()
    addAndPrint(7, 8)

    local arr2 = [1, 2]
    -- method-style insert (parser supports dotted/colon calls)
    table.insert(arr2, 2, 99)
    print("arr2 after insert: " .. table.concat(arr2, ","), 1)
end

function labels()
    --@label inline single line label
    print("Hello, ", "World!", 2) --@val2 world text
    --@label-start multiline label start
    print("This is inside a multiline label", 2)
    --@label-end
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
    test6()
    test7()
    test8()
    test9()
    test_string_indexing()
    test10()
end

