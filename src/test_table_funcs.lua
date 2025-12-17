function main()
    local a = [1, 2, 3]
    local a = table.insert(a, 4)
    print(table.insert(a, 2, 9), 1)
    table.remove(a)
    table.remove(a, 2)
    local s = table.concat(a, ",")
    print(s, 1)
end
