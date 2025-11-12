export const Links = [
	{ type: 'link', url: '/', title: 'Homepage', maxScreen: 'md' },
	{
		type: 'portfolio',
		url: 'https://gemsandgoblins.com/',
		title: 'Gems and Goblins',
		img: '/img/gems-and-goblins-alt.avif',
		imgDesktop: 'object-contain',
		imgMobile: 'object-contain',
		text: `
		Gems and Goblins is a turn based mobile RPG set in a fantasy world with extensive lore. It's built in
		Unreal Engine and has a Symfony backend.<br>
		<br>
		My role in the team was backend development, game testing and building websites. As a small team we
		worked very closely and spent a lot of time brainstorming and building game mechanics.<br>
		<br>
		Although my role was server oriented, I did have insight into the client and kept up with the unreal 
		codebase, helping out on the side.
		`,
	},
	{
		type: 'portfolio',
		url: 'https://wemakegames.sk/',
		title: 'WeMakeGames',
		img: '/img/we-make-games.png',
		imgDesktop: 'object-cover',
		imgMobile: 'object-cover',
		text: `
		WeMakeGames is a small game studio (~15 people) where I worked as a developer. I joined development
		during Gems and Goblins and participated on few additional yet unreleased titles.<br>
		<br>
		Alongside developing I helped directing, copy writing, preparing documents, communicating with
		shareholders and public. It was a very fast and inspiring environment, where everyone showed up with
		their absolute best.
		`,
	},
	{
		type: 'portfolio',
		url: 'https://superhivemarket.com/products/gamepad-camera-control',
		title: 'Gamepad Camera Control',
		img: '/img/gamepad-camera-control.png',
		imgDesktop: 'object-cover',
		imgMobile: 'object-cover',
		text: `
		Gamepad Camera Control is a separately sold Blender plugin. It provides gamepad support and allows
		controling cameras in the scene. It records keyframes and streamlines creation of captivating 
		trailers.<br>
		<br>
		I started out as an advisor and helped by integrating SDL. Pretty early I overtook as a lead developer,
		and after a complete refactor we continued implementing fixes and additional features. Codebase is in
		python and utilises the Blender plugin API.
		`,
	},
	{
		type: 'portfolio',
		url: 'https://github.com/xgallom/zengine',
		title: 'Zengine',
		img: '/img/zengine.png',
		imgDesktop: 'object-contain',
		imgMobile: 'object-cover',
		text: `
		Zengine is my one-person 3D game engine built in Zig on top of SDL. The project is slowly crawling its
		way out of infancy.<br>
		<br>
		Most work done is still preliminary, but it has a working math library, gpu passes, shaders, materials,
		lighting, texturing, scene graph and extensive performance monitoring.
		`,
	},
] as const;
