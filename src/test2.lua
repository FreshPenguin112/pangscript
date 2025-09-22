function main() 
    local arr: array = {1, 2, 3}
    local obj: object = {a=1, b=2}
    local s: string = "hello"
    print(#arr, 1)    -- uses jsJSON_json_array_length
    print(#obj, 1)
    print(#s, 1)      -- uses operator_length
    print(arr[1], 1)
end