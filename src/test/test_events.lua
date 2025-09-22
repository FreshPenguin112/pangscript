function main()
  print("Hello, world!", 1)
end
event_whenkeypressed("a", function()
  print("Pressed A", 1)
end)

event_whenkeypressed("a", function()
  print("Another handler", 1)
end)

-- A whenflagclicked handler
event_whenflagclicked(function()
  print("Flag clicked", 1)
end)
