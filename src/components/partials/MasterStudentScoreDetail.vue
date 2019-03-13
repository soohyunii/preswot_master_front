<template>
	<div id="class_index_wrapper">
		<div>
			<el-table class="elTable" :data="page" style="width:100%">
				<el-table-column prop="name" label="학생이름" width="100">
				</el-table-column>
				<el-table-column prop="birth" label="생년월일" width="120">
				</el-table-column>

				<el-table-column prop="address" label="이수과목" width="220">
				</el-table-column>
				<el-table-column prop="phone" label="학점" width="85">
				</el-table-column>
				<el-table-column prop="sex" label="학기" width="150">
				</el-table-column>
				<el-table-column prop="sex" label="담당강사" width="100">
				</el-table-column>
				<el-table-column prop="sex" label="이해도" width="100">
				</el-table-column>
				<el-table-column prop="sex" label="집중도" width="100">
				</el-table-column>
				<el-table-column prop="sex" label="참여도" width="100">
				</el-table-column>
				<el-table-column prop="sex" label="최종학점" width="90">
				</el-table-column>
			</el-table>

		</div>
	</div>
</template>

<script>
</script>