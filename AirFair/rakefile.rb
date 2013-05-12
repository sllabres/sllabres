require 'peach'

@game_name = "taxi"

task :default => [:uglify, :javascript_test]

# set path value for phantomjs
task :javascript_test do
	Dir["tests/*.htm"].peach do |file|
		sh "phantomjs resources/run-qunit.js #{file}"		
	end
end

task :compile do 
	scripts = Array.new

	Dir.glob('scripts/**/*.ts') do |item|  		
  		scripts.push item  		
	end

	scripts.peach do |script|
		sh "tsc #{script} -out scripts"
	end
end

task :jslint => :compile do	
	sh "jsl -conf resources/jsl.default.conf"	
end

task :uglify => :jslint do	
	scripts = Array.new

	Dir.glob('scripts/**/*.js') do |item|  		
  		scripts.push item
	end	

	scripts.peach do |script|
		sh "uglifyjs #{script} -o #{script}"
	end
end

task :git_commit_and_push do
	puts "Committing changes."
	sh "git add ."
	sh "git commit -m \"Automated Commit\""
	sh "git push origin master"
end