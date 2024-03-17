# getting meta data      ruby index.rb
meta_data = `netsh wlan show profiles`

# decoding meta data
data = meta_data.force_encoding('utf-8')

# splitting data by line by line
data = data.split("\n")

# creating a list of profiles
profiles = []

# traverse the data
data.each do |line|
  # find "All User Profile" in each item
  if line.include?("All User Profile")
    # if found, split the item
    i = line.split(":")
    # item at index 1 will be the wifi name
    i = i[1].strip # remove leading and trailing whitespaces
    # appending the wifi name to the list
    profiles << i
  end
end

# printing heading
puts format("%-40s %-10s", "Wi-Fi Name", "Password")
puts

# traversing the profiles
profiles.each do |profile|
  begin
    # getting meta data with password using wifi name
    results = `netsh wlan show profile "#{profile}" key=clear`
    # decoding and splitting data line by line
    results = results.force_encoding('utf-8').split("\n")
    # finding password from the result list
    password_line = results.find { |b| b.include?("Key Content") }
    password = password_line ? password_line.split(":")[1..-1].join(':').strip : ''
    # if there is a password, it will print the password
    puts format("%-40s %-10s", profile, password)
  # called when this process gets failed
  rescue StandardError
    puts "Encoding Error Occurred"
  end
end
