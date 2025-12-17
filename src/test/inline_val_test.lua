function main()
    print("hi", 5) --@val1 greeting @val2 5 seconds
end

event_whenkeypressed("k", function()
    --@label-start Outer block label
    --@label-start Nested inner label
    -- Inner note
    --@label-end
    print("Key K pressed", 1)
    --@label-end
end)

event_whenflagclicked(function()
    --@label Handler for flag
    print("flagged", 1)
end)
