<template>
	<div id="class_index_wrapper">
		<div>
			<el-table class="elTable" :data="page" style="width:100%">
				<el-table-column prop="email_id" label="메일주소" width="180">
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>