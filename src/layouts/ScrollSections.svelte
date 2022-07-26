<section class="gallery-3d">
	<div class="webgl">
		<canvas />
	</div>
	<div class="scroll-dummy" />
	<div class="title-screen">
		<div class="flex-wrapper" />
	</div>
	<div class="progress-bar" />
</section>

<style lang="scss">
	.gallery-3d {
		display: block;
		background-color: rgb(57, 66, 42);
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: none;
		background-color: #000;
		will-change: transform;
	}

	.webgl {
		position: fixed;
		top: 0;
		left: 0;

		canvas {
			outline: none;
		}
	}
	.scroll-dummy {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1;
		overflow: auto;
		height: 100%;
		display: none;
		-ms-overflow-style: none;
		scrollbar-width: none;

		&:not(.disable-snap) {
			-ms-scroll-snap-type: y mandatory;
			scroll-snap-type: y mandatory;
			-webkit-overflow-scrolling: touch;
		}
	}

	.title-cards {
	}

	.title-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		visibility: hidden;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.5);

		.flex-wrapper {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			width: 100%;
			height: 100%;
			-webkit-box-pack: center;
			-ms-flex-pack: center;
			justify-content: center;
			-webkit-box-align: center;
			-ms-flex-align: center;
			align-items: center;
			-webkit-box-orient: vertical;
			-webkit-box-direction: normal;
			-ms-flex-direction: column;
			flex-direction: column;
		}
	}

	.progress-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 5px;
		width: 0;
		-webkit-transform: translateY(5px);
		transform: translateY(5px);
		background-color: #fff;
	}

	.card {
		scroll-snap-align: start;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
	}
</style>
