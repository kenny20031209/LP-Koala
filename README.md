# LP-Koala

## DLASSP Project 

## Project Overview
The DLASSP project is conceived as a comprehensive and customisable LMS, tailored specifically for a unique user system consisting of Admins, Researchers, and Raters. The platform is intended to provide a versatile digital environment where the users can manage, participate in, and evaluate a variety of educational and assessment-oriented projects. Each user group is granted access privileges aligned with their operational scope and responsibilities to facilitate efficient project management, content creation, user interaction, and data analysis.

## Project Goal
**Develop a Customisable and Secure LMS**: Create a platform that can be tailored to the roles of Admin, Researchers, and Raters, ensuring secure and correct access to content and features according to user roles.<br>
**Enable Efficient Project and User Management**: Implement comprehensive administrative functions for user management.<br>
**Facilitate Specialised Content Creation and Management**: Equip researchers with advanced tools for creating, editing, and managing educational content.<br>
**Enhance Rater Interaction and Engagement**: Allow raters to engage with the content through interactive activities and provide meaningful feedback.<br>
**Ensure Data Security and Integrity**: Prioritise the protection of sensitive information.<br>
**Establish a Collaborative Environment**: Build forums where users can share insights, discuss evaluations, and contribute to the collective knowledge base.

## Team Introduction
**Weiyang Wu** - Product Owner: As the product owner, Weiyang is the visionary driving the project forward. He is responsible for defining the goals and creating the product roadmap.<br>
**Haofeng Chen** - Scrum Master: Haofeng serves as the scrum master of team, acting as the glue that holds the team together by ensuring the Scrum framework is properly implemented for the maximum efficiency and effectiveness.<br>
**Gaoyuan Ou** - Front-end Developer: Gaoyuan mainly focuses on the front end development.<br>
**Mingxin Li** - UX/UI Designer: Mingxin crafts user-friendly and aesthetically pleasing interfaces.<br>
**Yujin Du** - Back-end Developer: Yujin mainly focuses on the back end development.<br>
**Qinglin Zhao** - Back-end Developer: Qinglin will be commited to the back end development together with Yujin.<br>

## Project Information

### Usage<br>

Please click the following link to access our product to check our progress:<br>
https://lp-koala-frontend-1e10ff20d284.herokuapp.com/<br><br>
There are three accounts for testing currently:<br>
Username: admin<br>
Password: password<br><br>
Username: researcher<br>
Password: password<br><br>
Username: rater1<br>
Password: password<br>

### Side notes<br>

Feel free to create user accounts using the admin account. For security reasons, we design the user creation only available via admin’s portal, instead of users creating an account and waiting for admin’s approval.
Funcitonalities are implemented according to project requirements. There is no need for instruction as our UI design is user-friendly and intuitive.
Since this is our temporary version of our project, some funcitonalities are not yet implemented. Some functionalities are subject to change for completeness and robustness. Furhter updates will be available in the later weeks.<br>

### Configuration<br>

#### Login Token Expiry Time<br>

Currently, once a user logins, the login token will be expired in 5 minutes and the user will have to login again. We set this time to demonstrate the JWT expiry functionality. This is suject to change later according to client’s needs.<br>

#### Website Domain Name<br>

Since we deploy our project via Heruko for demonstration purposes for now, the domain name is https://lp-koala-frontend-1e10ff20d284.herokuapp.com/. This is subject to change later in the subject.<br>

## Workflow
#### Our project uses a Git Flow branching strategy to streamline development and ensure stability:<br>
**main**: This is the primary branch where the source code of HEAD always reflects a production-ready state. It's central to our development and deployment process.<br>
**frontend**: This branch is used for development specific to the frontend part of our project. Developers working on user interface components, client-side logic, and styling would use this branch.<br>
**deploy-frontend**: This branch is used for deploying frontend changes. It acts as a staging or pre-production branch where frontend updates are tested in an environment that closely replicates the production setting before these changes are merged into the main branch and deployed to production.<br>
**backend**: Similar to the frontend branch, this one focuses on backend development. This would include server-side logic, database management, API development, etc.<br>
**trigger**: Specifically used for AI review processes, this branch handles tasks related to integrating, testing, or deploying AI models. It could be involved in automating reviews of code or content through AI tools.<br>
**deployment**: Unlike the deploy-frontend branch, which specifically handles frontend deployments, this branch is used for deploying backend changes. It manages backend-specific configurations and deployment scripts, ensuring that backend updates can be rolled out smoothly and efficiently.

### Naming Conventions<br>
**Branches**: Use a clear, descriptive name that reflects the feature or fix, prefixed accordingly: feature/, bugfix/, or release/. Example: feature/add-user-profiles.<br>
**Commits**: Start with a verb in the imperative mood, followed by a concise description: "Add user login functionality".<br>
**Pull Requests**: Title should match the branch purpose, and the description should clearly explain the change, including any relevant issue or task numbers.

### Workflow Process<br>
**Task Assignment**: Tasks are assigned during the sprint planning meeting, documented in our project management tool.<br>
**Development**: Work on your assigned tasks in the corresponding branch type. Regularly push your changes to the remote repository.<br>
**Code Review**: Once a task is completed, open a PR for code review. At least one other team member must review and approve the changes.<br>
**Testing**: After approval, the changes are tested. This includes unit tests, integration tests, and manual testing where necessary.<br>
**Merging**: Once testing is passed, the PR is merged into the develop branch. Release branches are merged into main and develop once they are ready for deployment.<br>
**Deployment**: Changes in the main branch are deployed to production according to our release schedule.


## Release
### Release v1.0<br>
Release v1.0 provides a host of new features designed to enhance the user experience. Here are the critical updates:<br>
**User Login**: Users can login the LMS system by prividing username and password. And according to different user roles, their accesses will vary, so the UI will also be various. We also set a jwt token to check if the login status has expired.<br>
**User Access**: For raters, they can view alllocated projects and activities in the project while researchers can have access to creating, editing and deleting projects and activities. Meanwhile, the researchers can choose to allocate the raters or remove the allocated raters. For admin, besides the researchers' access, they can also create or delete a user. All the users can change password or edit their profiles.<br>
**Project Function**: A project is composed of several modules. Projects can be created,edited and deleted by researchers. A module consist of several activities. Modules can be created and deleted by researchers. Activities will display the teaching materials for raters to study, and they can also be created, edited, and deleted by researchers.

### Release v2.0<br>
Except the functions implemented in Release v1.0, some new features are developed as mentioned in the sprint 3 requirements. Here are the critical updates:<br>
**Rating**: After studying an activity, raters can rate the current activity from one star to five stars. Moreover, the researchers has the access to downloading the rating data to do the further analysis.<br>
**Furom**: The researchers can create a thread while the raters can write a post replying to the thread. They can check the answers and discuss their own ideas through the threads.
