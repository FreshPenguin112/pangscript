function main()
    --[[
        The below code demonstrates how to use loops
        You can use for loops and while loops to repeat code.
        The for loop iterates over a range of numbers, while the while loop continues until a condition is false.
    ]]--
    for i = 1, 5 do -- This loops from 1 to 5
        print("This is iteration number: " .. i)
    end
    local j = 1
    while j <= 5 do -- This loops while j is less than or equal to 5
        print("This is iteration number: " .. j)
        local j = j + 1
    end
    --[[
        For loops can also have a step value, which is the third argument in the for loop.
        The step value determines how much the loop variable is incremented each iteration.
        The below code demonstrates a for loop with a step value of 2.
    ]]--
    for i = 1, 5, 2 do -- This loops from 1 to 5 with a step value of 2, i will be set as follows: 1, 3, 5.
        print("This is iteration number: " .. i)
    end
end