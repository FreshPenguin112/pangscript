function main() 
    local arr: array = {1, 2, 3}
    local obj: object = {a=1, b=2}
    local s: string = "hello"
    print(#arr)    -- uses json_array_length
    print(#s)      -- uses operator_length
end