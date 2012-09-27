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
	nunit.assemblies "./Sllabres.Web.Test/Sllabres.Web.Test.csproj"
	nunit.options '/xml=Sllabres.Tests-Results.xml'
end

task :git_commit_and_push => :test do
	comment = ask('Enter Comment: ')
	`git add .`
	`git commit -m "#{comment}"`
	`git push origin master`
end

def ask message
	print message
	STDIN.gets.chomp
end