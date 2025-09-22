function main()
	print("Hello from comments test", 1) --@val: greeting literal
end

event_whenkeypressed("k", function()
    --@label-start Multi-line block describing the following handler
    -- This additional comment line should be included in the block text
    print("Key K pressed", 1)
    --@label-end
end)

-- Inline handler with a preceding label

event_whenflagclicked(function()
    --@label Handler for flag
	print("flagged", 1)
end)