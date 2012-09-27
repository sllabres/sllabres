task :default => [:git_commit_and_push]

task :git_commit_and_push do
	comment = ask('Enter Comment: ')
	`git add .`
	`git commit -m "#{comment}"`
	`git push origin master`
end

def ask message
	print message
	STDIN.gets.chomp
end