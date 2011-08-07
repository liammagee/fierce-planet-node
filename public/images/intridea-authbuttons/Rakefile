require 'fileutils'

ARTBOARDS = {
  "01" => "twitter",
  "02" => "facebook",
  "03" => "linkedin",
  "04" => "google",
  "05" => "openid",
  "06" => "yahoo",
  "07" => "aol",
  "08" => "myspace",
  "09" => "github",
  "10" => "basecamp",
  "11" => "campfire",
  "12" => "presently"
}

desc "Rename automatically exported files to their proper service names." 
task :rename do
  FileList["**/*"].each do |file|
    ext = File.extname(file)
    dir = File.dirname(file)
    
    if file.match /.*-[0-9]{2}\..(?:png|jpg)/i
      size, index = File.basename(file).split('.')[0].split('-')
      `mv #{file} #{dir}/#{ARTBOARDS[index]}_#{size}#{ext}`
      puts "+ Moved #{file} to #{dir}/#{ARTBOARDS[index]}_#{size}#{ext}"
    elsif file.match /authbuttons-([0-9]{2})\.eps/i
      `mv #{file} #{dir}/#{ARTBOARDS[$1]}.eps`
    end
  end
end