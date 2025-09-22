--@label This is the top-level greeting
function main()
	print("Hello from comments test", 1) --@val: greeting literal
end

--@label-start Multi-line block describing the following handler
-- This additional comment line should be included in the block text
--@label-end
event_whenkeypressed("k", function()
	print("Key K pressed", 1)
end)

-- Inline handler with a preceding label
--@label Handler for flag
event_whenflagclicked(function()
	print("flagged", 1)
end)

--@label This line labels the following simple statement
print("end of test", 1)
