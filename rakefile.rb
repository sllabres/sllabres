require 'albacore'
task :default => [:git_commit_and_push]

desc "Build Solution"
msbuild :build do |msb|
	msb.properties :configuration => :Debug
	msb.targets :Clean, :Build
	msb.solution = "sllabres.sln"
end

desc "Run unit tests"
nunit :test => :build do |nunit|
	nunit.command = "../Library/NUnit/bin/nunit-console.exe"
	nunit.assemblies "./sllabres.web.test/sllabres.web.test.csproj"
	nunit.options '/xml=Sllabres.Tests-Results.xml'
end

task :git_commit_and_push => :test_javascript do
	puts "Committing changes."
	puts `git add .`	
	puts `git commit -m "Automated Commit"`
	puts `git push origin master`
end

task :test_javascript => :test do
	Dir["sllabres.web/Scripts/tests/*.htm"].each do |file|
		phantom_result = `phantomjs sllabres.web/Scripts/tests/run-qunit.js #{file}`
		puts phantom_result
		fail "Javascript test failure" if !phantom_result.include? '0 failed'
	end	
end

def ask message
	print message
	STDIN.gets.chomp
end